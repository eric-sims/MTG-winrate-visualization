# read a csv file 
import pandas as pd

# read the csv file and return a dataframe
def readCSV(fileName):
    df = pd.read_csv(fileName, low_memory=False)
    return df

if __name__ == "__main__":
    df = readCSV('Utah_Crash_Data_2020.csv')
    
    # create a new dataframe with only the columns we need
    categories = ["COMMERCIAL_MOTOR_VEH_INVOLVED", "DISTRACTED_DRIVING", "DOMESTIC_ANIMAL_RELATED", "DROWSY_DRIVING", "DUI", "IMPROPER_RESTRAINT", "INTERSECTION_RELATED", "MOTORCYCLE_INVOLVED", "NIGHT_DARK_CONDITION", "OLDER_DRIVER_INVOLVED", "OVERTURN_ROLLOVER", "PEDESTRIAN_INVOLVED", "ROADWAY_DEPARTURE", "SINGLE_VEHICLE", "TEENAGE_DRIVER_INVOLVED", "UNRESTRAINED", "WILD_ANIMAL_RELATED", "WORK_ZONE_RELATED"]

    df = df[categories]

    # create a json object with 'source' and 'target' keys with values being the frequency of the relationship
    # between the two categories
    json = []
    # build the json object
    for j in range(len(categories)):
        for k in range(j+1, len(categories)):
            obj = {}
            obj['source'] = categories[j]
            obj['target'] = categories[k]
            value = 0
            for i in range(len(df)):
                if df.iloc[i][categories[j]] == True and df.iloc[i][categories[k]] == True:
                    value += 1
            obj['value'] = value

            json.append(obj)

    # write the json object to a file
    with open('links.json', 'w') as f:
        f.write(str(json))


