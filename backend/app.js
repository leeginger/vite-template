import cors from 'cors';
import express from 'express';
import { resolve } from 'node:path';
import fileUpload from 'express-fileupload';
import { createUser } from './lib/user.js';

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(resolve('./public')));
app.use(fileUpload());
app.use(cors());

app.post('/api/signup', async (request, response) => {
  const { username, useremail, userpassword } = request.body;

  if (!username || !useremail || !userpassword) {
    return response.status(400).send(`
      <p style="color: red">회원가입에 필요한 이름, 이메일, 패스워드 모두 입력이 필요합니다.</p>
    `);
  }

  try {
    console.log('📌 회원가입 요청 도착:', request.body);
    // 새 사용자 생성 (백엔드 스토리지)
    const newUser = await createUser({
      name: username,
      email: useremail,
      password: userpassword,
    });

    if (newUser) {
      const { password, ...user } = newUser;
      response.status(201).json(user);
    } else {
      response.status(400).json({
        message: `${username}님은 ${useremail} 이메일 주소로 회원 가입을 이미 하셨습니다. 😥`,
      });
    }
    console.log('✅ 회원가입 성공:', newUser);
    response.status(201).json(newUser);
  } catch (error) {
    console.error('❌ 회원가입 중 서버 오류:', error);
    response.status(500).json(error);
  }
});

app.get('/api/hello', (request, response) => {
  const { username, useremail } = request.query;
  if (username && useremail) {
    response.status(200).send(`
      <h1>hello ${username}!</h1>
      <p>your email address is ${useremail}</p>
    `);
  } else {
    response
      .status(400)
      .send('<p>사용자 이름과 이메일이 전송되지 않았습니다. 😥</p>');
  }
});

app.listen(4000, () => {
  console.log('백엔드 프로그램 서버 구동 http://localhost:4000/api/hello');
});
