run local harhat fork 
npx hardhat node --show-stack-traces

contract deploy 
npx hardhat run scripts/deploy.js --network localhost

test if works 
npx hardhat run scripts/interact.js --network localhost