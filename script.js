
const File  = require('./models/file');
const fs  = require('fs');
const connectDB = require('./config/db');
connectDB();



async function deleteData() {
    //24 hours more files
    const pastDate = new Date(Date.now() - 24*60*60*1000);
    const files = await File.find({ createdAt: { $lt: pastDate } });

    if (files.length) {
        try {
            for (const file of files) {
                try {
                    fs.unlinkSync(file.path);
                    await file.remove();
                    console.log(`successfully deleted the file`);
                } catch (e) {
                     console.log(`Error while deleting file ${e}`);
                }
            }
        } catch (err) {
             console.log(`Error while looping files ${err}`);
        }
    }
    console.log('Job done!');
    
}

deleteData().then(
    process.exit()
)