// write any test no need to require

test('My first test', () => {
    console.log("Hello duniya!");
})

function add(a, b) {
    return a + b;
}

test('Testing the output of add ', () => {
    // expectation vs reality
    expect(add(3, 2)).toBe(5);      // .toBe means exactly same
})

// two objects are not same 
test('testing two objects', () => {
    const obj = {
        name: "Aryan",
        age: 20
    }
// so use .toEqual
    expect(obj).toEqual({
        name: "Aryan",
        age: 20
    })
})

test('testing null', ()=>{
    let n = null;
    let a = undefined;
    let b = 7;

    expect(n).toBeNull();
    expect(a).toBeUndefined();
    expect(b).toBeDefined();
    /**
     * toBeGreaterThan
     * toBeGreaterThanOrEqual
     * toBeLessThan
     * toBeLessThanOrEqual
     */
})