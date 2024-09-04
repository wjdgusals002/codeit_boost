const uploadImage = (file) => {
    // 업로드된 파일 경로를 반환 (이 경로를 DB에 저장)
    const imageUrl = `/uploads/${file.filename}`;
    return imageUrl;
};

export default { uploadImage };
