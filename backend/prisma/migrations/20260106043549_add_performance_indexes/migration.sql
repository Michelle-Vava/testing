-- CreateIndex
CREATE INDEX "service_requests_status_idx" ON "service_requests"("status");

-- CreateIndex
CREATE INDEX "service_requests_status_createdAt_idx" ON "service_requests"("status", "createdAt");

-- CreateIndex
CREATE INDEX "users_providerOnboardingComplete_idx" ON "users"("providerOnboardingComplete");

-- CreateIndex
CREATE INDEX "users_rating_idx" ON "users"("rating");

-- CreateIndex
CREATE INDEX "users_providerOnboardingComplete_rating_idx" ON "users"("providerOnboardingComplete", "rating");
