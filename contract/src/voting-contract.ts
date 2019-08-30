/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Voting } from './voting';

@Info({title: 'VotingContract', description: 'My Smart Contract' })
export class VotingContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async candidateExists(ctx: Context, candidateName: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(candidateName);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createCandidate(ctx: Context, candidateName: string): Promise<void> {
        const exists = await this.candidateExists(ctx, candidateName);
        if (exists) {
            throw new Error(`The candidate ${candidateName} already exists`);
        }
        const voting = new Voting();
        voting.candidateName = candidateName;
        const buffer = Buffer.from(JSON.stringify(voting));
        await ctx.stub.putState(candidateName, buffer);
    }

    @Transaction(false)
    @Returns('Voting')
    public async readCandidate(ctx: Context, candidateName: string): Promise<Voting> {
        const exists = await this.candidateExists(ctx, candidateName);
        if (!exists) {
            throw new Error(`The candidate ${candidateName} does not exist`);
        }
        const buffer = await ctx.stub.getState(candidateName);
        const candidate = JSON.parse(buffer.toString()) as Voting;
        return candidate;
    }

    @Transaction()
    public async castVote(ctx: Context, candidateName: string): Promise<void> {
        const exists = await this.candidateExists(ctx, candidateName);
        if (!exists) {
            throw new Error(`The candidate ${candidateName} does not exist`);
        }
        const candidate = await this.readCandidate(ctx, candidateName);
        candidate.votes += 1;
        const buffer = Buffer.from(JSON.stringify(candidate));
        await ctx.stub.putState(candidateName, buffer);
    }

    @Transaction()
    public async deleteCandidate(ctx: Context, candidateName: string): Promise<void> {
        const exists = await this.candidateExists(ctx, candidateName);
        if (!exists) {
            throw new Error(`The candidate ${candidateName} does not exist`);
        }
        await ctx.stub.deleteState(candidateName);
    }

}
