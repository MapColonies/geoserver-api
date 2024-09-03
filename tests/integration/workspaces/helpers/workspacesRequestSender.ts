import * as supertest from 'supertest';
import { WorkspaceRequest } from '../../../../src/common/interfaces';

export class WorkspaceRequestSender {
  public constructor(private readonly app: Express.Application) {}

  public async getWorkspaces(): Promise<supertest.Response> {
    return supertest.agent(this.app).get('/workspaces').set('Content-Type', 'application/json');
  }

  public async getWorkspace(name: string): Promise<supertest.Response> {
    return supertest.agent(this.app).get(`/workspaces/${name}`).set('Content-Type', 'application/json');
  }

  public async createWorkspace(body: WorkspaceRequest): Promise<supertest.Response> {
    return supertest.agent(this.app).post(`/workspaces`).send(body).set('Content-Type', 'application/json');
  }

  public async updateWorkspace(oldName: string, newName: string): Promise<supertest.Response> {
    return supertest.agent(this.app).put(`/workspaces/${oldName}/${newName}`).set('Content-Type', 'application/json');
  }

  public async deleteWorkspace(name: string, isRecursive?: boolean): Promise<supertest.Response> {
    return supertest.agent(this.app).delete(`/workspaces/${name}`).query({ recurse: isRecursive }).set('Content-Type', 'application/json');
  }

  // public async createResource(): Promise<supertest.Response> {
  //   return supertest.agent(this.app).post('/resourceName').set('Content-Type', 'application/json');
  // }
}
