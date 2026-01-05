import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService implements OnModuleInit {
    private configService;
    private supabase;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    getClient(): SupabaseClient;
    from(table: string): import("@supabase/postgrest-js").PostgrestQueryBuilder<any, any, any, string, unknown>;
    getAuth(): any;
    getStorage(): any;
}
