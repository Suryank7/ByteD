const File  = require('./models/file');
const fs  = require('fs');
const connectDB = require('./config/db');
connectDB();

async function deleteData() {
    // Files older than 24 hours
    const pastDate = new Date(Date.now() - 24*60*60*1000);
    const files = await File.find({ createdAt: { $lt: pastDate } });

    if (files.length) {
        for (const file of files) {
            try {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
                await File.deleteOne({ _id: file._id });
                console.log(`Successfully deleted file: ${file.filename}`);
            } catch (e) {
                console.log(`Error while deleting file ${file.filename}: ${e}`);
            }
        }
    }
    console.log('Cleanup job done!');
}

deleteData().then(() => {
    console.log('Process finished.');
    process.exit();
}).catch(err => {
    console.error('Error in cleanup job:', err);
    process.exit(1);
});