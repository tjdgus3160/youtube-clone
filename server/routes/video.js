const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require('multer');
var ffmpeg = require("fluent-ffmpeg");

//=================================
//             Video
//=================================
let storage = multer.diskStorage({
    destination: (req,file, cb) => {    // 파일 저장 위치
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); // 파일 저장 이름
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.mp4'){
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true);
    }
});

const upload = multer({storage}).single('file');

router.post('/uploadfiles', (req, res) => {
    // 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if(err){
            return res.json({success: false, err});
        }
        return res.json({success: true, url: res.req.file.path, fileName: res.req.file.filename});
    })
})

router.post('/uploadVideo', (req, res) => {
    // 비디오를 DB에 저장한다.
    const video = new Video(req.body);

    video.save((err, doc) => {
        if(err) return res.json({success: false, err});
        res.status(200).json({success: true});
    });
})

router.post('/thumbnail', (req, res) => {

    let filePath = "";
    let fileDuration = "";

    // 비디오 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        fileDuration = metadata.format.duration; // 비디오 러닝타임
    })

    // 썸네일 생성, 
    ffmpeg(req.body.url)    // 비디오 저장 경로
    .on('filenames', function(filenames){ // 썸네일 파일 이름 생성
        filePath = 'uploads/thumbnails/'+filenames[0];
    })
    .on('end', function(){ // 썸네일 생성 성공
        return res.json({success: true, url: filePath, fileDuration: fileDuration});
    })
    .on('error', function (err){
        return res.json({success: false, err});
    })
    .screenshots({  // 옵션
        count: 3,   // 썸네일 개수
        folder: 'uploads/thumbnails',   // 저장 위치
        size: '320x240',    // 썸네일 크기
        // %b : 확장자를 제외한 파일 원래 이름
        filename: 'thumbnail-%b.png'
    })
})

module.exports = router;
