'use strict';
const students=['Nguyễn Bình An','Trần Huỳnh Anh','Vương Gia Bảo','Tống Huyền Diệu','Lê Văn Dũng','Trần Bảo Duy','Hoàng Ngọc Mai Hân','Trần Thảo Ngọc Hân','Đỗ Lường Minh Hiếu','Trần Hương Quỳnh Hương','Hồ Nguyễn Anh Khoa','Nguyễn Minh Khoa','Nguyễn Khôi','Phạm Nhân Kiệt','Nguyễn Phúc Lâm','Vũ Thùy Diệu Linh','Nguyễn Châu Long','Nguyễn Hoàng Bình Minh','Trương Uyên My','Nguyễn Bảo Nam','Phạm Thị Tuyết Ngân','Lưu Bảo Ngọc','Nguyễn Bảo Ngọc','Mai Trần Minh Nhân','Nguyễn Ngọc Văn Nhân','Từ Khánh Nhi','Trương Thanh Phong','Nguyễn Phương Duy Phước','Trịnh Thị Phương Phương','Lê Phạm Anh Quân','Nguyễn Hoàng Quân','Huỳnh Cao Sang','Trần Xuân Toàn','Võ Lê Yến Trâm','Lê Ngọc Hải Yến'];
const teacher='Phạm Quốc Thắng',owner='Hồ Nguyễn Anh Khoa';
const nameKey=v=>v.normalize('NFC').trim().replace(/\s+/g,' ').toLocaleLowerCase('vi');
const names=new Map([...students,teacher].map(n=>[nameKey(n),n]));
module.exports={students,teacher,owner,nameKey,names};
