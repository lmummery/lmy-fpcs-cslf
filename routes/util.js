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
	}
}