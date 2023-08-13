import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Chance } from 'chance';
import { AppModule } from '../src/app.module';

const chance = new Chance();

describe('AppResolver (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it('helloWorld (Query)', () => {
  //   // TODO assert return value
  //   return request(app.getHttpServer())
  //     .post('/graphql')
  //     .send({
  //       query: '{ helloWorld }',
  //     })
  //     .expect(200);
  // });
  // it('hello (Query)', () => {
  //   // TODO assert return value
  //   const name = chance.name();
  //   return request(app.getHttpServer())
  //     .post('/graphql')
  //     .send({
  //       query: `{ hello(name: "${name}") }`,
  //     })
  //     .expect(200);
  // });

  it('mutation login($data: LoginInput!)', () => {
    const login = `mutation login($data: LoginInput!) {
      login(data:$data) {
        accessToken
      }
    }`;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        variables: {
          data: {
            email: 'lisa@simpson1.com',
            password: 'secret42',
          },
        },
        query: login,
      })
      .expect(({ error }) => {
        if (error) {
          console.error(JSON.parse(error.text));
        }
      })
      .expect(200);
  });
});
