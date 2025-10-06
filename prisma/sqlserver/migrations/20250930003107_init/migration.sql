BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [password] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [Users_role_df] DEFAULT 'user',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Users_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Storages] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [url] NVARCHAR(1000) NOT NULL,
    [filename] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Storages_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Storages_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Artist] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [name] NVARCHAR(1000),
    [nickname] NVARCHAR(1000),
    [nationality] NVARCHAR(1000),
    CONSTRAINT [Artist_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Duration] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [start] INT,
    [end] INT,
    CONSTRAINT [Duration_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Tracks] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [name] NVARCHAR(1000),
    [album] NVARCHAR(1000),
    [cover] NVARCHAR(1000),
    [artistId] UNIQUEIDENTIFIER,
    [durationId] UNIQUEIDENTIFIER,
    [mediaId] UNIQUEIDENTIFIER,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Tracks_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    CONSTRAINT [Tracks_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Tracks_durationId_key] UNIQUE NONCLUSTERED ([durationId])
);

-- AddForeignKey
ALTER TABLE [dbo].[Tracks] ADD CONSTRAINT [Tracks_artistId_fkey] FOREIGN KEY ([artistId]) REFERENCES [dbo].[Artist]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Tracks] ADD CONSTRAINT [Tracks_durationId_fkey] FOREIGN KEY ([durationId]) REFERENCES [dbo].[Duration]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
