
# read a csv file 
import pandas as pd
import utm

# read the csv file and return a dataframe
def readCSV(fileName):
    df = pd.read_csv(fileName, low_memory=False)
    return df

# add new columns to the dataframe
def addColumns(df):
    df['lat'] = 0.00
    df['lon'] = 0.00        

if __name__ == "__main__":
    df = readCSV('data/Utah_Crash_Data_2020.csv')
    addColumns(df)

    # convert utm to lat/lon
    for index, row in df.iterrows():
        # if there is an exception, remove the row
        try:
            lat, lon = utm.to_latlon(row['LONG_UTM_X'], row['LAT_UTM_Y'], 12, 'ST')
            df.loc[index, 'lat'] = lat
            df.loc[index, 'lon'] = lon
        except:
            df.drop(index, inplace=True)

    # write the dataframe to a new csv file
    df.to_csv('data/Utah_Crash_Data_2020_cleaned.csv', index=False)
