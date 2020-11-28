class SlotMachine {

  constructor(props) {

    this.props = props;

    let errors = this.initialCheckUp();
    if (errors) throw new Error(errors);

    this.ranges = props.ranges;
    this.numberOfSlots = props.numberOfSlots;
    this.maxSingleSlotValue = props.maxSingleSlotValue;
    this.spinAttempts = props.ranges.length;
  }

  initialCheckUp() {
    let props = this.props;
    let errors = '';

    if (typeof props !== 'object' || Array.isArray(props) ||
        Object.keys(props).length === 0) {
      errors += 'Initialization error: ' +
          'class argument should be an Object { ranges: array, numberOfSlots: number, maxSingleSlotValue: number }.\n';
    }

    if (errors) return errors;

    if (!'ranges' in props || !Array.isArray(props.ranges)) {
      errors += 'Initialization error: "ranges" should be a not empty array.\n';
    }
    if (!'numberOfSlots' in props || isNaN(props.numberOfSlots) ||
        props.numberOfSlots % 1 !== 0) {
      errors += 'Initialization error: "numberOfSlots" should be a number (Integer).\n';
    }
    if (!'maxSingleSlotValue' in props ||
        isNaN(props.maxSingleSlotValue || props.numberOfSlots % 1 !== 0)) {
      errors += 'Initialization error: "maxSingleSlotValue" should be a number (Integer).\n';
    }

    if (errors) return errors;

    props.ranges.forEach((el) => {
      let rangeBoundaries = el.split('-');
      if (props.numberOfSlots > rangeBoundaries[1] ||
          props.numberOfSlots * props.maxSingleSlotValue < rangeBoundaries[0]) {
        errors += 'Range value error: range "' + el + '" is unreachable\n';
      }
    });

    return errors;
  }

  pickRandomRangeBoundaries() {
    const rangePosition = Math.floor(Math.random() * this.spinAttempts);
    const range = this.ranges[rangePosition];
    this.ranges.splice(rangePosition, 1);
    const rangeBoundaries = range.split('-');
    return {
      minPossibleValue: rangeBoundaries[0],
      maxPossibleValue: rangeBoundaries[1],
    };
  }

  rollDice() {
    return Math.floor(Math.random() * this.maxSingleSlotValue + 1);
  }

  generateSlotValues() {
    let slotValues = [];
    for (let i = 0; i < this.numberOfSlots; i++) {
      slotValues.push(this.rollDice());
    }
    return slotValues;
  }

  validateSlotValues() {
    let slotValues = this.generateSlotValues();
    let slotValuesSum = slotValues.reduce((sum, a) => sum + a);
    const { minPossibleValue, maxPossibleValue } = this.pickRandomRangeBoundaries();

    while (slotValuesSum < minPossibleValue || slotValuesSum >
    maxPossibleValue) {
      slotValues = this.generateSlotValues();
      slotValuesSum = slotValues.reduce((sum, a) => sum + a);
    }
    return slotValues;
  }

  spin() {
    let slotValues;
    if (this.spinAttempts > 0) {
      slotValues = this.validateSlotValues();
      this.spinAttempts--;
    } else {
      return 'Fail! No more spin attempts';
    }
    return slotValues;
  }

}

module.exports = SlotMachine;