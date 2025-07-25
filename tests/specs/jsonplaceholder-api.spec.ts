import { test, expect, request, APIRequestContext } from '@playwright/test';
import { ApiClient } from '../clients/apiClient';
import { buildPostData } from '../utils/dataBuilder';
import { expectAllToHaveProperty } from '../utils/assertions';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('JSONPlaceholder API Automation', () => {
  let apiContext: APIRequestContext;
  let api: ApiClient;

  test.beforeAll(async () => {
    apiContext = await request.newContext();
    api = new ApiClient(apiContext, BASE_URL);
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('GET /posts', async () => {
    const response = await api.get('/posts');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('GET /posts/1', async () => {
    const response = await api.get('/posts/1');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('id', 1);
  });

  test('GET /posts/1/comments', async () => {
    const response = await api.get('/posts/1/comments');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    expectAllToHaveProperty(body, 'postId', 1);
  });

  test('GET /comments?postId=1', async () => {
    const response = await api.get('/comments?postId=1');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    expectAllToHaveProperty(body, 'postId', 1);
  });

  test('POST /posts', async () => {
    const newPost = buildPostData({ title: 'foo', body: 'bar' });
    const response = await api.post('/posts', newPost);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toMatchObject(newPost);
    expect(body).toHaveProperty('id');
  });

  test('PUT /posts/1', async () => {
    const updatedPost = buildPostData({ id: 1, title: 'updated', body: 'updated body' });
    const response = await api.put('/posts/1', updatedPost);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toMatchObject(updatedPost);
  });

  test('PATCH /posts/1', async () => {
    const patchData = { title: 'patched title' };
    const response = await api.patch('/posts/1', patchData);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('title', 'patched title');
  });

  test('DELETE /posts/1', async () => {
    const response = await api.delete('/posts/1');
    expect(response.ok()).toBeTruthy();
  });
}); 