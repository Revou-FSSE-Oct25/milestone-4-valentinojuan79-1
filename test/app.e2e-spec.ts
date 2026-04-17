import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';

const request = require('supertest');

describe('Banking API (E2E Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe()); 
    await app.init();
  });

  it('/auth/register (POST) - Skenario Berhasil', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `tester${Date.now()}@mail.com`,
        password: 'Password123!',
        name: 'E2E Tester'
      })
      .expect(201);
  });

  it('/auth/login (POST) - Skenario Salah Password (401)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'ngasal@mail.com',
        password: 'salah-total'
      })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});