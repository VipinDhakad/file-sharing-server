import cron from 'node-cron';
import fs from 'fs';
import File from './models/file.js'; // Adjust the path as needed

// Schedule a cleanup task to run daily at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running cleanup job...');
    const MAX_FILE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const cutoffTime = new Date(Date.now() - MAX_FILE_AGE);

    try {
        // Find files older than the cutoff time
        const oldFiles = await File.find({ createdAt: { $lt: cutoffTime } });

        oldFiles.forEach(async (file) => {
            const filePath = file.path;

            // Delete the file from the filesystem
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file ${filePath}:`, err);
                } else {
                    console.log(`Deleted file: ${filePath}`);
                }
            });

            // Remove the file record from the database
            await File.findByIdAndDelete(file._id);
        });

        console.log('Cleanup job completed.');
    } catch (error) {
        console.error('Error during cleanup job:', error.message);
    }
});
