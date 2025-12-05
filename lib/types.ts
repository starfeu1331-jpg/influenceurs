// Types pour remplacer les enums Prisma (SQLite ne supporte pas les enums)

export enum Platform {
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  YOUTUBE = 'YOUTUBE',
  OTHER = 'OTHER',
}

export enum StatsPeriod {
  LAST_15_DAYS = 'LAST_15_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_3_MONTHS = 'LAST_3_MONTHS',
}

export enum FormatType {
  REEL = 'REEL',
  STORY = 'STORY',
  TIKTOK_VIDEO = 'TIKTOK_VIDEO',
  YOUTUBE_INTEGRATION = 'YOUTUBE_INTEGRATION',
  YOUTUBE_DEDICATED = 'YOUTUBE_DEDICATED',
  OTHER = 'OTHER',
}

export type PlatformType = keyof typeof Platform;
export type StatsPeriodType = keyof typeof StatsPeriod;
export type FormatTypeType = keyof typeof FormatType;
