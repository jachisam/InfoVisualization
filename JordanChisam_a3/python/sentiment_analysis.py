
# coding: utf-8

# In[138]:


# References:
# https://text-processing.com/demo/sentiment/

## Sentiment Analysis, can check if word is positive or negative

# Functions
import math, glob, os, ntpath
from collections import defaultdict

def checkIfInSentimentList(word, list_):
    if word in list_:
        print("The word is in the list!")
    else:
        print("The word is not in the list!")
        
def preprocess(s, case = "L"):
    if case == "L":
        s = s.lower()
    elif case == "U":
        s = s.upper()
    return s

def tokenize(s, tokenize_char=None):
    punctuations = "—-,.?!;:\n\t"
    s = [t.strip(punctuations) for t in s.split(tokenize_char)]
    s = [t for t in s if t != '']
    return s

def removeNewLine(s, tokenize_char=None):
    punctuations = "\n"
    s.strip(punctuations)
    return s

def fileToList(file):
    with open(file) as f:
        text = tokenize(preprocess(f.read()))
        return text
    
def path_leaf(path):
    head, tail = ntpath.split(path)
    return tail or ntpath.basename(head)
        
        
# Data
corpus_path = "/Users/jordanchisam/Desktop/JordanChisam_a3/englishfairytales/corpus/*.txt"
positive_words = "/Users/jordanchisam/Desktop/JordanChisam_a3/englishfairytales/positive-words.txt"
negative_words = "/Users/jordanchisam/Desktop/JordanChisam_a3/englishfairytales/negative-words.txt"
pos_words = fileToList(positive_words)
neg_words = fileToList(negative_words)


# boole = False
# with open(path+positive_words) as f:
#     lines = f.read().splitlines()
#     if "happy" in lines:
#         boole = True
#     print(lines)
    
# print(boole)

    


files = glob.glob(corpus_path)
word_count = 0
positive = 0
negative = 0
neutral = 0
count = 0
d = {}
for f in files:
    with open(f) as f:
        first_line = f.readline()
        text = f.read()
        text = tokenize(preprocess(text))
        for word in text:  
            word_count = word_count + 1
            if word in pos_words:
                positive = positive + 1
            elif word in neg_words:
                negative = negative + 1

        wc = positive + negative
        name = removeNewLine(first_line)
        positive_score = round((positive/(positive+negative))*100,2)
        negative_score = round((negative/(positive+negative))*100,2)
        sentiment_score = round((positive-negative)/(positive+negative)*100,2)
        d[count] = {
            "title": name.strip('\n'),
            "positive": positive,
            "negative": negative,
            "wc_pn": wc,
            "positive_score": positive_score,
            "negative_score": negative_score,
            "sentiment_score": sentiment_score
        }
        count = count + 1;
        print(name)
        print("Word Count", wc)
        print("Pos: " , positive, "           ", round((positive/wc)*100,2),"%")
        print("Neg: " , negative, "          ", round((negative/wc)*100,2),"%")
        print("Positive Score: " , round((positive/(positive+negative))*100,2),"%")
        print("Negative Score: " , round((negative/(positive+negative))*100,2),"%")
        print("Sentiment Score: " , round((positive-negative)/(positive+negative)*100,2))
        positive = 0
        negative = 0
        wc = 0
        print("------------------------------------")
        

print (d)

jsonFile = "/Users/jordanchisam/Desktop/JordanChisam_a3/englishfairytales/englishfairytales_sentiment_analysis.json"
import json
 
json = json.dumps(d)
f = open(jsonFile, "w")
f.write(json)
f.close()

