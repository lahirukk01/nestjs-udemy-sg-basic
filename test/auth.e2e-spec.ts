import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth Functionality (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('User signup (POST)', () => {
    const email = 'teste2e@email.com';
    return request
      .agent(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password' })
      .expect(201)
      .then((response) => {
        const { user } = response.body;
        expect(user).toBeDefined();
        expect(user.email).toEqual(email);
      });
  });

  it('User signup and get the current user (POST)', () => {
    const email = 'teste2e2@email.com';
    return request
      .agent(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password' })
      .expect(201)
      .then((response) => {
        const cookie = response.header['set-cookie'];

        return request
          .agent(app.getHttpServer())
          .get('/auth/whoami')
          .set('Cookie', cookie)
          .expect(200)
          .then((response) => {
            const { user } = response.body;

            expect(user).toBeDefined();
            expect(user.email).toEqual(email);
          });
      });
  });
});
