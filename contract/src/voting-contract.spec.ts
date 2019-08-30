/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context } from 'fabric-contract-api';
import { ChaincodeStub, ClientIdentity } from 'fabric-shim';
import { VotingContract } from '.';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import winston = require('winston');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext implements Context {
    public stub: sinon.SinonStubbedInstance<ChaincodeStub> = sinon.createStubInstance(ChaincodeStub);
    public clientIdentity: sinon.SinonStubbedInstance<ClientIdentity> = sinon.createStubInstance(ClientIdentity);
    public logging = {
        getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
        setLevel: sinon.stub(),
     };
}

describe('VotingContract', () => {

    let contract: VotingContract;
    let ctx: TestContext;

    beforeEach(() => {
        contract = new VotingContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"candidateName":"1001","votes":0}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"candidateName":"1002","votes":0}'));
    });

    describe('#candidateExists', () => {

        it('should return true for a candidate', async () => {
            await contract.candidateExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a candidate that does not exist', async () => {
            await contract.candidateExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createCandidate', () => {

        it('should create a candidate', async () => {
            await contract.createCandidate(ctx, '1003');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"votes":0,"candidateName":"1003"}'));
        });

        it('should throw an error for a candidate that already exists', async () => {
            await contract.createCandidate(ctx, '1001').should.be.rejectedWith(/The candidate 1001 already exists/);
        });

    });

    describe('#readCandidate', () => {

        it('should return a candidate', async () => {
            await contract.readCandidate(ctx, '1001').should.eventually.deep.equal({candidateName: '1001', votes: 0});
        });

        it('should throw an error for a candidate that does not exist', async () => {
            await contract.readCandidate(ctx, '1003').should.be.rejectedWith(/The candidate 1003 does not exist/);
        });

    });

    describe('#castVote', () => {

        it('should cast a vote', async () => {
            await contract.castVote(ctx, '1001');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"candidateName":"1001","votes":1}'));
        });

        it('should throw an error for a candidate that does not exist', async () => {
            await contract.castVote(ctx, '1003').should.be.rejectedWith(/The candidate 1003 does not exist/);
        });

    });

    describe('#deleteCandidate', () => {

        it('should delete a candidate', async () => {
            await contract.deleteCandidate(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a candidate that does not exist', async () => {
            await contract.deleteCandidate(ctx, '1003').should.be.rejectedWith(/The candidate 1003 does not exist/);
        });

    });
});
