const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) {
            return res.render("download", { error: 'Link is expired' });
        }

        // 24h expiration check
        const timeDiff = new Date() - new Date(file.createdAt);
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff >= 24) {
            const fs = require('fs');
            try {
                // Delete actual file
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            } catch (err) {
                console.error("Error deleting expired file:", err);
            }
            // Delete from DB
            await file.deleteOne(); 
            return res.render("download", { error: 'File is deleted' });
        }

        return res.render("download", {
          uuid: file.uuid,
          fileName: file.filename,
          fileSize: file.size,
          size: `${parseInt(file.size/1000)} KB`,
          downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
        });
        
    }
    catch (err) {
        return res.render('download', {error:'Something went wrong.'})
    }
});

module.exports = router;