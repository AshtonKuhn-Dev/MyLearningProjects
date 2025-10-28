#THIS IS THE MAIN APPLICATION, RUN IT IN GOOGLE COLAB
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
url = 'https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv'#Titanic Dataset
df = pd.read_csv(url)
print(df['Age'].mean())
print(df["Embarked"].mode())
df["Age"].fillna(29.7, inplace=True)
df["Embarked"].fillna("S",inplace=True)
df.drop(["PassengerId","Name","Ticket","Cabin"],axis=1,inplace=True)#Remove Bad Columns
df["Sex"]=df["Sex"].map({"female":0,"male":1})#Convert Sex to binary
df = pd.get_dummies(df,columns=["Embarked"],drop_first=True)#Split Embarked into 3 and drop the first one and make them binary
X = df.drop("Survived", axis=1)#Features (What the Model uses to predict)
Y = df["Survived"]#Target (What the Model tries to perdict)
X_train, X_test, Y_train, Y_test = train_test_split(X,Y,test_size=0.2, random_state=42)#Split into train and test features and labels with 80 20 split.

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier


from sklearn.metrics import accuracy_score, confusion_matrix

model = RandomForestClassifier(n_estimators=1000, random_state=42)
model.fit(X_train, Y_train)
predictions = model.predict(X_test)
accuarcy = accuracy_score(Y_test, predictions)
print(f"Accuarcy: {accuarcy*100:.2f}%")
df["Fare"].value_counts()

new_passanger = pd.DataFrame({
    "Pclass":[1],
    "Sex":[0],
    "Age":[35],
    "SibSp":[2],
    "Parch":[2],
    "Fare":[50],
    "Embarked_Q":[0],
    "Embarked_S":[1]

})
prediction = model.predict(new_passanger)
print(prediction)