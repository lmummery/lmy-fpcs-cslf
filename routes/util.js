module.exports = {
	getFileExt: function (mimetype)
	{
		// Dictionary of common MIME types
		const types = {
			"audio/aac": "aac",
			"video/x-msvideo": "avi",
			"image/bmp": "bmp",
			"text/css": "css",
			"text/csv": "csv",
			"application/msword": "doc",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
			"application/epub+zip": "epub",
			"application/gzip": "gz",
			"image/gif": "gif",
			"text/html": "html",
			"image/vnd.microsoft.icon": "ico",
			"application/java-archive": "jar",
			"image/jpeg": "jpg",
			"text/javascript": "js",
			"audio/mpeg": "mp3",
			"video/mp4": "mp4",
			"video/mpeg": "mpeg",
			"application/vnd.oasis.opendocument.presentation": "odp",
			"application/vnd.oasis.opendocument.spreadsheet": "ods",
			"application/vnd.oasis.opendocument.text": "odt",
			"audio/ogg": "ogg",
			"image/png": "png",
			"application/pdf": "pdf",
			"application/vnd.ms-powerpoint": "ppt",
			"application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
			"application/vnd.rar": "rar",
			"application/rtf": "rtf",
			"image/svg+xml": "svg",
			"application/x-tar": "tar",
			"image/tiff": "tiff",
			"text/plain": "txt",
			"application/vnd.visio": "vsd",
			"audio/wav": "wav",
			"audio/webm": "weba",
			"video/webm": "webm",
			"image/webp": "webp",
			"application/vnd.ms-excel": "xls",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
			"application/xml": "xml",
			"application/zip": "zip",
			"application/x-7z-compressed": "7z"
		}

		// Return .bin as a default - binary file
		return types[mimetype] !== undefined ? types[mimetype] : "bin"
	},

	getFileStr: function (mimetype)
	{
		// Dictionary of common MIME types
		const types = {
			"audio/aac": "AAC audio file",
			"video/x-msvideo": "AVI video file",
			"image/bmp": "Bitmap image file",
			"text/css": "Cascasing Stylesheet",
			"text/csv": "Comma-Separated Values file",
			"application/msword": "Microsoft Word 93 Document",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Microsoft Word Document",
			"application/epub+zip": "EPUB",
			"application/gzip": "gzip archive",
			"image/gif": "Graphics Interchange Format image",
			"text/html": "HTML document",
			"image/vnd.microsoft.icon": "Icon",
			"application/java-archive": "Java jar archive",
			"image/jpeg": "JPEG image",
			"text/javascript": "JavaScript file",
			"audio/mpeg": "mp3 audio file",
			"video/mp4": "mp4 video file",
			"video/mpeg": "MPEG video file",
			"application/vnd.oasis.opendocument.presentation": "OpenDocument Presentation file",
			"application/vnd.oasis.opendocument.spreadsheet": "OpenDocument Spreadsheet file",
			"application/vnd.oasis.opendocument.text": "OpenDocument Text file",
			"audio/ogg": "ogg audio file",
			"image/png": "PNG image",
			"application/pdf": "PDF document",
			"application/vnd.ms-powerpoint": "PowerPoint 93 presentation",
			"application/vnd.openxmlformats-officedocument.presentationml.presentation": "Microsoft PowerPoint presentation",
			"application/vnd.rar": "RAR archive",
			"application/rtf": "Rich Text Format text",
			"image/svg+xml": "SVG graphics file",
			"application/x-tar": "tar archive",
			"image/tiff": "TIFF image",
			"text/plain": "Text Document",
			"application/vnd.visio": "Microsoft Visio Diagram",
			"audio/wav": "WAV audio",
			"audio/webm": "weba audio",
			"video/webm": "webm video",
			"image/webp": "webp image",
			"application/vnd.ms-excel": "Excel 93 Spreadsheet",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Microsoft Excel Spreadsheet",
			"application/xml": "XML Document",
			"application/zip": "zip archive",
			"application/x-7z-compressed": "7zip archive"
		}

		// Return .bin as a default - binary file
		return types[mimetype] !== undefined ? types[mimetype] : "bin"
	}
}