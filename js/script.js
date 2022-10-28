
Promise.all([d3.csv('../data/Utah_Crash_Data_2020.csv')]).then( data =>
    {
        let crashData = data[0];
        
        let table = new googleMap(crashData);
        table.draw();
    });