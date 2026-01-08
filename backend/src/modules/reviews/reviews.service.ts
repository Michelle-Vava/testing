import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateReviewDto, UpdateReviewDto, RespondToReviewDto } from './dto/review.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new review for a completed job
   * Only the job owner can create a review
   */
  async create(userId: string, createReviewDto: CreateReviewDto) {
    const { jobId, rating, comment } = createReviewDto;

    // Get the job with all necessary details
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        review: true,
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    // Validate that user is the job owner
    if (job.ownerId !== userId) {
      throw new ForbiddenException('Only the job owner can leave a review');
    }

    // Validate that job is completed
    if (job.status !== 'completed') {
      throw new BadRequestException('Can only review completed jobs');
    }

    // Check if review already exists
    if (job.review) {
      throw new BadRequestException('Review already exists for this job');
    }

    // Create the review
    const review = await this.prisma.review.create({
      data: {
        jobId,
        providerId: job.providerId,
        ownerId: userId,
        rating,
        comment,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            businessName: true,
          },
        },
      },
    });

    // Update provider's overall rating
    await this.updateProviderRating(job.providerId);

    return review;
  }

  /**
   * Get all reviews for a provider
   */
  async findByProviderId(providerId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { providerId },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          job: {
            select: {
              id: true,
              request: {
                select: {
                  title: true,
                  vehicle: {
                    select: {
                      make: true,
                      model: true,
                      year: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.review.count({
        where: { providerId },
      }),
    ]);

    return {
      reviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single review by ID
   */
  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            businessName: true,
          },
        },
        job: {
          select: {
            id: true,
            request: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  /**
   * Update a review (only by the review owner)
   */
  async update(id: string, userId: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.ownerId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const updated = await this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            businessName: true,
          },
        },
      },
    });

    // Update provider's overall rating if rating changed
    if (updateReviewDto.rating !== undefined) {
      await this.updateProviderRating(review.providerId);
    }

    return updated;
  }

  /**
   * Respond to a review (only by the provider)
   */
  async respond(id: string, userId: string, respondDto: RespondToReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.providerId !== userId) {
      throw new ForbiddenException('Only the provider can respond to this review');
    }

    return this.prisma.review.update({
      where: { id },
      data: {
        response: respondDto.response,
        respondedAt: new Date(),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            businessName: true,
          },
        },
      },
    });
  }

  /**
   * Delete a review (only by the review owner)
   */
  async delete(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.prisma.review.delete({
      where: { id },
    });

    // Update provider's overall rating
    await this.updateProviderRating(review.providerId);

    return { message: 'Review deleted successfully' };
  }

  /**
   * Get review for a specific job (if exists)
   */
  async findByJobId(jobId: string) {
    return this.prisma.review.findUnique({
      where: { jobId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
            businessName: true,
          },
        },
      },
    });
  }

  /**
   * Calculate and update provider's average rating
   */
  private async updateProviderRating(providerId: string) {
    const result = await this.prisma.review.aggregate({
      where: { providerId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    const averageRating = result._avg.rating ? new Decimal(result._avg.rating) : null;
    const reviewCount = result._count.rating;

    await this.prisma.user.update({
      where: { id: providerId },
      data: {
        rating: averageRating,
        reviewCount,
      },
    });
  }
}
