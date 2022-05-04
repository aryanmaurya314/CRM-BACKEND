// testing async functions


function fetchData(callback) {
    setTimeout(() => {
        callback("Aryan")
    }, 2000);
}

/**
 * 1. fetchBack expects a call back function
 * 2. callback function should have only 1 arg
 * 3. if  we execute this function by passing callback fn after 2 seconds call back function will be called with the argument "Aryan"
 */
/*
test('testing the callback fn', ()=>{
    function callback(data){
        expect(data).toBe("Aryan");
    }
    fetchData(callback);
})
*/
test('testing the callback fn', (done) => {
    try {
        function callback(data) {
            expect(data).toBe("Aryan");
            done();    // unless until this will call jest wait not come out of test
        }
    }catch(err){
        done(err);
    }
    fetchData(callback);
}) 