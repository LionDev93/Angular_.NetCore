using System;
using Xunit;
using Xunit.Sdk;
using FileUploadService.Controllers;
using FileUploadService.Models;
using FileUploadService.Context;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;


using System.Threading.Tasks;
using System.Collections.Generic;

namespace FileUploadService.Tests
{
    public class FileUploadControllerUnitTest
    {
        FileUploadController _controller;
        FileUploadServiceContext _context;
        public FileUploadControllerUnitTest()
        {

        }
        [Fact]
        public async void uploadedFiles_ReturnOkResult()
        {

            var options = new DbContextOptionsBuilder<FileUploadServiceContext>()
                .UseInMemoryDatabase(databaseName: "Add_writes_to_database")
                .Options;

            using (var context = new FileUploadServiceContext(options))
            {
                context.FileUpload.Add(new FileUpload
                {
                    id = 1,
                    filename = "test.png",
                    filesize = 123456,
                    filetype = "image/png",
                    updated_at = new DateTime(2019, 6, 1).ToString(),
                    username = "admin"
                });
                context.FileUpload.Add(new FileUpload
                {
                    id = 2,
                    filename = "test.mp4",
                    filesize = 123456,
                    filetype = "video/mp4",
                    updated_at = new DateTime(2019, 6, 2).ToString(),
                    username = "user"
                });
                context.SaveChanges();
            }

            using (var context = new FileUploadServiceContext(options))
            {
                var controller = new FileUploadController(context);

                var actionResult = await controller.UploadedFiles("image");
                
                Assert.Equal(1, actionResult[0].id);
                Assert.Equal(123456, actionResult[0].filesize);
            }
        }
    }
}
