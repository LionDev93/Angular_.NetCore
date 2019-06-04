using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace FileUploadService.Context
{
    public class FileUploadServiceContext : DbContext
    {
        public FileUploadServiceContext (DbContextOptions<FileUploadServiceContext> options)
            : base(options)
        {
        }

        public DbSet<FileUploadService.Models.FileUpload> FileUpload { get; set; }
    }
}
