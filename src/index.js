const VirtualMachine = require('./virtual-machine');

//add by yj
VirtualMachine.Scratch3ControlBlocks = require('./blocks/scratch3_control');
VirtualMachine.Scratch3MotionBlocks = require('../src/blocks/scratch3_motion');
VirtualMachine.Scratch3LooksBlocks = require('./blocks/scratch3_looks');
VirtualMachine.Scratch3SensingBlocks = require('../src/blocks/scratch3_sensing');
VirtualMachine.Scratch3PenBlocks = require('./extensions/scratch3_pen/index');
VirtualMachine.Scratch3SoundBlocks = require('./blocks/scratch3_sound');
VirtualMachine.Scratch3DataBlocks = require('../src/blocks/scratch3_data');
VirtualMachine.Scratch3PuzzleBlocks = require('./blocks/scratch3_puzzle');

VirtualMachine.Scratch3RenderedTarget = require('./sprites/rendered-target');

module.exports = VirtualMachine;
