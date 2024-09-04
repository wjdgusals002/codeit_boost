

const imageController = {
    async uploadImage(req, res) {
        try {
            if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
            }
            const imageUrl = `/uploads/${req.file.filename}`;
            res.status(200).json({ imageUrl });
        } catch (error) {
            console.error('Error uploading image:', error);
            res.status(500).json({ error: 'Failed to upload image' });
        }
    },
};

export default imageController;
