/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Voting } from './voting';

@Info({title: 'VotingContract', description: 'My Smart Contract' })
export class VotingContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async votingExists(ctx: Context, votingId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(votingId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createVoting(ctx: Context, votingId: string, value: string): Promise<void> {
        const exists = await this.votingExists(ctx, votingId);
        if (exists) {
            throw new Error(`The voting ${votingId} already exists`);
        }
        const voting = new Voting();
        voting.value = value;
        const buffer = Buffer.from(JSON.stringify(voting));
        await ctx.stub.putState(votingId, buffer);
    }

    @Transaction(false)
    @Returns('Voting')
    public async readVoting(ctx: Context, votingId: string): Promise<Voting> {
        const exists = await this.votingExists(ctx, votingId);
        if (!exists) {
            throw new Error(`The voting ${votingId} does not exist`);
        }
        const buffer = await ctx.stub.getState(votingId);
        const voting = JSON.parse(buffer.toString()) as Voting;
        return voting;
    }

    @Transaction()
    public async updateVoting(ctx: Context, votingId: string, newValue: string): Promise<void> {
        const exists = await this.votingExists(ctx, votingId);
        if (!exists) {
            throw new Error(`The voting ${votingId} does not exist`);
        }
        const voting = new Voting();
        voting.value = newValue;
        const buffer = Buffer.from(JSON.stringify(voting));
        await ctx.stub.putState(votingId, buffer);
    }

    @Transaction()
    public async deleteVoting(ctx: Context, votingId: string): Promise<void> {
        const exists = await this.votingExists(ctx, votingId);
        if (!exists) {
            throw new Error(`The voting ${votingId} does not exist`);
        }
        await ctx.stub.deleteState(votingId);
    }

}
