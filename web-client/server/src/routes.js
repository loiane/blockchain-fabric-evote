const os = require('os');
const path = require('path');
const fabricNetwork = require('fabric-network');
const express = require('express');
const router = express.Router();

const SmartContractUtil = require('./smart-contract-util');

const homedir = os.homedir();
const walletPath = path.join(homedir, '.fabric-vscode', 'wallets', 'local_fabric_wallet');
const gateway = new fabricNetwork.Gateway();
const wallet = new fabricNetwork.FileSystemWallet(walletPath);
const identityName = 'admin';

async function connect() {
    const connectionProfile = await SmartContractUtil.getConnectionProfile();

    const discoveryAsLocalhost = SmartContractUtil.hasLocalhostURLs(connectionProfile);
    const discoveryEnabled = true;
    const options = {
        wallet: wallet,
        identity: identityName,
        discovery: {
            asLocalhost: discoveryAsLocalhost,
            enabled: discoveryEnabled
        }
    };
    await gateway.connect(connectionProfile, options);
}

async function queryAll(req, res) {
    await connect();

    const args = [];
    const response = await SmartContractUtil.submitTransaction('VotingContract', 'queryAll', args, gateway);

    gateway.disconnect();

    res.status(200).json(JSON.parse(response.toString()));
}

async function readCandidate(req, res) {
    await connect();

    const candidateName = req.params.id;
    const args = [candidateName];

    try {
        const response = await SmartContractUtil.submitTransaction('VotingContract', 'readCandidate', args, gateway);
        gateway.disconnect();
        res.status(200).json(JSON.parse(response.toString()));
    } catch(e) {
        res.status(500).send(e);
    }
}

async function createCandidate(req, res) {
    await connect();

    const candidateName = req.body.candidateName;
    const args = [candidateName];

    try {
        const response = await SmartContractUtil.submitTransaction('VotingContract', 'createCandidate', args, gateway);
        console.log(response.toString());
        gateway.disconnect();
        res.status(20).json(candidateName);
    } catch(e) {
        res.status(500).send(e);
    }
}

async function castVote(req, res) {
    await connect();

    const candidateName = req.params.id;
    const args = [candidateName];

    try {
        const response = await SmartContractUtil.submitTransaction('VotingContract', 'castVote', args, gateway);
        console.log(response.toString());
        gateway.disconnect();
        res.status(200).json(candidateName);
    } catch(e) {
        res.status(500).send(e);
    }
}

async function deleteCandidate(req, res) {
    await connect();

    const args = [req.params.id];

    try {
        const response = await SmartContractUtil.submitTransaction('VotingContract', 'deleteCandidate', args, gateway);
        console.log(response.toString());
        gateway.disconnect();
        res.status(200).json(candidateName);
    } catch(e) {
        res.status(500).send(e);
    }
}

router.get('/', (req, res) => queryAll(req, res));
router.get('/:id', (req, res) => readCandidate(req, res));
router.post('/', (req, res) => createCandidate(req, res));
router.put('/:id', (req, res) => castVote(req, res));
router.delete('/:id', (req, res) => castVote(req, res));

module.exports = router;