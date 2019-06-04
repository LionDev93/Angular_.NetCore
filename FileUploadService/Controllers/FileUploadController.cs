using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using FileUploadService.Context;
using FileUploadService.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;

namespace FileUploadService.Controllers
{
    public class FileUploadController : Controller
    {
        enum ValidationResult
        {
            FileTypeInvalid,
            FileSizeInvalid,
            Success,
        }

        private readonly long fileMaxSize = 10 * 1024 * 1024;
        private readonly string[] validFileTypes = new string[] { "image", "video" };

        private readonly FileUploadServiceContext _context;

        public FileUploadController(FileUploadServiceContext context)
        {
            _context = context;
        }

        [EnableCors]
        public IActionResult Index()
        {
            return View();
        }

        private ValidationResult validationForFile(IFormFile fp)
        {
            if (fp.Length <= 0 || fp.Length > fileMaxSize)
            {
                return ValidationResult.FileSizeInvalid;
            }
            else
            {
                bool isValid = false;
                for (int i = 0; i < validFileTypes.Length; i++)
                {
                    if (fp.ContentType.StartsWith(validFileTypes[i]))
                    {
                        isValid = true;
                        break;
                    }
                }

                if (!isValid)
                    return ValidationResult.FileTypeInvalid;
            }

            return ValidationResult.Success;
        }


        [HttpGet]
        public async Task<List<FileUpload>> UploadedFiles(string fileType)
        {
            return await _context.FileUpload.Where(s => s.filetype.StartsWith(fileType)).ToListAsync();
        }

        [HttpPost, DisableRequestSizeLimit]
        public async Task<ActionResult<FileUpload>> Upload()
        {
            try
            {
                StringValues username;
                try
                {
                    Request.Form.TryGetValue("username", out username);
                }
                catch(ArgumentNullException ex)
                {
                    return BadRequest();
                }
                
                var file = Request.Form.Files[0];
                var folderPath = Path.Combine("Resources", "Upload");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderPath);

                ValidationResult vResult = validationForFile(file);
                if (vResult == ValidationResult.Success)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderPath, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    //If file upload success, Add to Database
                    var fileUpload = new FileUpload();
                    fileUpload.filename = fileName.Substring(0, fileName.LastIndexOf('.'));
                    fileUpload.filesize = file.Length;
                    fileUpload.filetype = file.ContentType;
                    fileUpload.updated_at = DateTime.Now.ToString("MM/dd/yyyy");
                    fileUpload.username = username;

                    _context.FileUpload.Add(fileUpload);
                    await _context.SaveChangesAsync();

                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}