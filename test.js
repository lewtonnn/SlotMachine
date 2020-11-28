const expect = require('chai').expect;
const SlotMachine = require('./index');

describe('Init a new Slot Machine', function() {
  it('should initialize a new Slot Machine', function() {
    const slotMachine = new SlotMachine({
      ranges: ['18-22', '10-28', '5-8'],
      numberOfSlots: 3,
      maxSingleSlotValue: 6,
    });

    expect(slotMachine.props).to.be.a('object');
    expect(slotMachine.spinAttempts).to.be.equal(3);

  });

  it('should initialize a new Slot Machine', function() {
    const slotMachine = new SlotMachine({
      ranges: ['18-22', '10-28', '5-8', '5-8', '10-28'],
      numberOfSlots: 3,
      maxSingleSlotValue: 6,
    });

    expect(slotMachine.props).to.be.a('object');
    expect(slotMachine.spinAttempts).to.be.equal(5);

  });

  it('should return error on initialization (wrong format of an argument) of a new Slot Machine',
      function() {
        function initSlotMachine() {
          new SlotMachine([]);
        }

        expect(initSlotMachine)
            .to
            .throw(Error,
                'Initialization error: class argument should be an Object { ranges: array, numberOfSlots: number, maxSingleSlotValue: number }.\n');
      });

  it('should return error on initialization (range is unreachable) of a new Slot Machine',
      function() {
        function initSlotMachine() {
          new SlotMachine({
            ranges: ['20-22', '10-28', '5-8'],
            numberOfSlots: 3,
            maxSingleSlotValue: 6,
          });
        }

        expect(initSlotMachine)
            .to
            .throw(Error,
                'Range value error: range "20-22" is unreachable');
      });
});

describe('Test Slot Machine methods', function() {
  it('should return one of provided ranges\' boundaries', function() {
    const slotMachine = new SlotMachine({
      ranges: ['13-15', '10-13', '6-9'],
      numberOfSlots: 3,
      maxSingleSlotValue: 6,
    });

    const rangeBoundaries = slotMachine.pickRandomRangeBoundaries();

    expect(rangeBoundaries).to.be.a('object');
    expect(rangeBoundaries.minPossibleValue)
        .to.be.oneOf(['6', '10', '13']);
    expect(rangeBoundaries.maxPossibleValue)
        .to.be.oneOf(['9', '13', '15']);
  });

  it('should return number from 1 to max single slot value', function() {
    const slotMachine = new SlotMachine({
      ranges: ['13-15', '10-13', '6-9'],
      numberOfSlots: 3,
      maxSingleSlotValue: 10,
    });

    const randomRoll = slotMachine.rollDice();

    expect(randomRoll).to.be.within(1, 10);
  });

  it('should return slot values', function() {
    const slotMachine = new SlotMachine({
      ranges: ['13-15', '10-13', '6-9'],
      numberOfSlots: 3,
      maxSingleSlotValue: 6,
    });

    const slotValues = slotMachine.validateSlotValues();
    const slotValuesSum = slotValues.reduce((sum, a) => sum + a);

    expect(slotValues).to.be.a('array');
    expect(slotValues.length).to.be.equal(3);
    expect(slotValuesSum).to.be.within(6, 15);

  });
});

