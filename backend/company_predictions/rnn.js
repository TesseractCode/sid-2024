const { fetchData } = require('../api_data/data_fetching.js');
const { izolate_data_on_years } = require('../api_data/data_izolation.js');
const tf = require('@tensorflow/tfjs');

// Function to prepare the data for RNN with last n years of data
function prepareData(data, n, k) {
    const x = [];
    const y = [];

    for (let i = n; i < data.length; i++) {
        const inputs = [];
        // Collect the last n years of data
        for (let j = n; j > 0; j --) {
            inputs.push(data[i - j]);
        }
        x.push(inputs); // Add the sequence of n years
        // Target: next year’s data
        y.push(data[i]);
    }

    return {
        x: tf.tensor3d(x, [x.length, n, k]), // Reshape to [samples, time steps, features]
        y: tf.tensor2d(y, [y.length, k]) // Reshape to [samples, output dimension]
    };
}

// Create a simple RNN model
function createModel(n, k) {
    const model = tf.sequential();
    model.add(tf.layers.simpleRNN({
        units: 10,
        inputShape: [n, k], // n time steps with 2 features
        activation: 'tanh'
    }));
    model.add(tf.layers.dense({ units: k })); // Output layer with 2 units for two predictions
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    return model;
}

// Train the model
async function trainModel(model, xTrain, yTrain) {
    const history = await model.fit(xTrain, yTrain, {
        epochs: 200,
        batchSize: 5,
        verbose: 1
    });
    return history;
}

const itp_cif = 16341004;

const run = async () => {
    const fetched_data = await fetchData(itp_cif);
    const features = ['cifra_de_afaceri_neta', 'profit_brut'];
    const izolated_data = await izolate_data_on_years(fetched_data, features);
    console.log(izolated_data);

    const k = features.length;
    const normalizer_values = []
    for (let i = 0; i < k; i ++)
    {
        normalizer_values.push(1);
    }

    const formated_data = [];
    for (let i = 0; i < izolated_data.length; i ++)
    {
        const data_row = [];
        for (let j = 0; j < k; j ++)
        {
            value = izolated_data[i][features[j]];
            if (value > normalizer_values[j])
            {
                normalizer_values[j] = value;
            }
            data_row.push(value);
        }
        formated_data.push(data_row);
    }


    for (let i = 0; i < formated_data.length; i ++)
    {
        for (let j = 0; j < k; j ++)
        {
            formated_data[i][j] /= normalizer_values[j];
        }
    }

    const train_data = formated_data;

    const n = 5; // Use the last 5 years of data
    const { x: xTrain, y: yTrain } = prepareData(train_data, n, k);

    const model = createModel(n, k);
    await trainModel(model, xTrain, yTrain);

    // Test the model with the last available n years of data (2023)
    const lastNYearsData = train_data.slice(-n); // Get the last n years of data
    // console.log(lastNYearsData.map(yearData => [yearData.cifra_de_afaceri_neta, yearData.profit_brut]));

    const test_input = tf.tensor3d([lastNYearsData], [1, n, k]); // Last n year input
    const prediction = model.predict(test_input);
    const array_prediction = prediction.arraySync();

    const results = [];
    for (let i = 0; i < array_prediction.length; i ++)
    {
        const a_result = [];
        for (let j = 0; j < k; j ++)
        {
            a_result.push(Math.round(array_prediction[i][j] * normalizer_values[j]));
        }
        results.push(a_result);
    }
    
    // Display the predicted values for 2024
    console.log(results);
}

run();


module.exports = { run };
