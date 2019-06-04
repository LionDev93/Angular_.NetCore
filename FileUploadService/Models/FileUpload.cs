using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace FileUploadService.Models
{
    public class FileUpload
    {
        [Key]
        public int id { get; set; }
        [Required]
        public string filename { get; set; }

        [Required]
        public long filesize { get; set; }

        [Required]
        public string filetype { get; set; }

        [Required]
        public string updated_at { get; set; }

        [Required]
        public string username { get; set; }
    }
}
