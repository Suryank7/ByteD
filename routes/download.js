const router = require('express').Router();
const File = require('../models/file');


router.get('/:uuid', async (req, res) => {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
        return res.render('download', { error: 'Link has been expired.' });
    }

    // 24h expiration check
    const timeDiff = new Date() - new Date(file.createdAt);
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff >= 24) {
        const fs = require('fs');
        try {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        } catch (err) {
            console.error("Error deleting expired file:", err);
        }
        await file.deleteOne();
        return res.render("download", { error: 'File is deleted' });
    }

    const filePath = `${__dirname}/../${file.path}`;
    res.download(filePath);
});


module.exports = router; 