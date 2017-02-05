class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this._initial = config.initial;
        this._states = config.states;
        this._current = this._initial;
        this._history = [];
        this._history.push(this._initial);
        this._undoHistory = [];
        this._count = 0;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this._current;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        var states = Object.keys(this._states);
        for (var i = 0; i < states.length; i++) {
            if (states[i] == state) {
                this._current = state;
                this._history.push(state);
                return this;
            }
        };
        throw new Error();
}

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var state = this._states[this._current];
        for (var key in state.transitions) {
            if (key == event) {
                this._current = state.transitions[key];
                this._history.push(state.transitions[key]);
                this._count++;
                return this;
            }
        }
        throw new Error()
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this._current = this._initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        var states = [];
        if (arguments.length == 0) {
            for (var key in this._states) {
                states.push(key);
            };
            return states;
        };
        for(var key in this._states) {
            for (var keys in this._states[key].transitions) {
                if (keys == event) {
                    states.push(key)
                }
            }
        };
        return states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this._current == this._initial) {
            return false;
        };
        if (this._history.length == 0) {
            return false;
        };
        this._undoHistory.push(this._current);
        this._current = this._history[this._history.length - 2];
        this._history.pop();
        this._count = 0;
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this._current == this._initial && this._undoHistory.length == 0) {
            return false;
        };
        if (this._undoHistory.length == 0) {
            return false
        };
        if (this._history.length == 0) {
            return false;
        };
        if(this._count > 0) {
            return false;
        }
        this._current = this._undoHistory[this._undoHistory.length - 1];
        this._history.push(this._current);
        this._undoHistory.pop();
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._history = [];
    }
}
module.exports = FSM;

/** @Created by Uladzimir Halushka **/
