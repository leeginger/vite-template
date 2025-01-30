import { useState } from 'react';
import './SignUp.css';

interface ResponseDataType {
  id: string;
  name: string;
  email: string;
}

function SignUp() {
  const [signup, setSignup] = useState<null | ResponseDataType>(null);

  const [error, setError] = useState<null | Error>(null);

  const handleSubmitAction = async (formData: FormData) => {
    try {
      const response = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        body: formData,
      });

      const jsonData = await response.json();

      if (response.status >= 400) {
        throw new Error((jsonData as { message: string }).message);
      }

      setSignup(jsonData as ResponseDataType);
    } catch (error) {
      setError(error as Error);
    }
  };
  if (error) {
    return (
      <div
        role="alert"
        style={{
          color: '#dc362f',
          display: 'flex',
          flexFlow: 'column',
          gap: 0,
          marginBlock: 20,
        }}
      >
        <h2 style={{ margin: 0 }}>{error.name}</h2>
        <p style={{ margin: 0 }}>{error.message}</p>
      </div>
    );
  }
  if (signup) {
    return (
      <article className="UserProfile" id={signup.id}>
        <h2 className="UserProfile--name">{signup.name}</h2>
        <p>{signup.email}</p>
      </article>
    );
  }
  return (
    <section className="signup-form">
      <h2>회원가입 폼</h2>
      <form
        // onSubmit={handleSubmitPromise}
        action={handleSubmitAction}
      >
        <div>
          <label htmlFor="usernameSignUp">이름</label>
          <input
            type="text"
            name="username"
            id="usernameSignUp"
            placeholder="2글자 이상 입력"
          />
        </div>
        <div>
          <label htmlFor="userEmailSignUp">이메일</label>
          <input
            type="email"
            name="useremail"
            id="userEmailSignUp"
            placeholder="user@company.io"
          />
        </div>
        <div>
          <label htmlFor="userPasswordSignUp">패스워드</label>
          <input
            type="password"
            name="userpassword"
            id="userPasswordSignUp"
            placeholder="숫자, 영문 조합 6자리 이상 입력"
          />
        </div>
        <div>
          <label htmlFor="userCheckPasswordSignUp">패스워드 확인</label>
          <input
            type="password"
            name="userpassword"
            id="userCheckPasswordSignUp"
            placeholder="입력한 패스워드 다시 입력"
          />
        </div>
        <button type="submit">
          <span>회원가입</span>
        </button>
      </form>
    </section>
  );
}
export default SignUp;
