# lcopt
Life cycle optimisation module

# Installation

For lcopt to work you should have the latest version of [brightway2](https://brightwaylca.org/) by Chris Mutel installed.
This will make sure all of lcopts dependencies are satisfied.
The instructions for installing brightway below are current as of April 2017, but check [here](https://docs.brightwaylca.org/installation.html) for the latest ones.
If you already have brightway installed, you can skip to the final step.

The best option is to use conda to create a separate environment, to avoid conflicts.

On the command line/console, create a new environment called lcopt

```
conda create -n lcopt python=3.6
```

Then activate the lcopt environment using one of these

```
# Mac/Linux
source activate lcopt
# Windows
activate lcopt
```
Then install brightway2

```
conda install -y -q -c conda-forge -c cmutel -c haasad brightway2 jupyter
```

On windows there's an extra dependency
```
conda install -y -q pywin32
```

Once brightway2 is ready fo go,  install lcopt via pip:

```
pip install lcopt
```

# Using the GUI

There are 2 options for using lcopt's GUI (LCOPT INTERACT)

## Option 1. Jupyter notebooks (More complicated, more powerful)

Probably the best way to use lcopt is via a jupyter notebook. This gives you more access to the inner workings if you need to get at something you can't see in the GUI.

`cd` into whatever folder you want your notebooks and lcopt models to be stored in, then start jupyter e.g.

```
activate lcopt
cd C:\Users\pjjoyce\Documents\01_Lcopt_models
jupyter notebook
```

This will fire up the jupyter notebook server in your browser.
Create a new notebook, give it a meaningful name.

Then in the first cell import lcopt
```python
from lcopt import *
```

Next create your LcoptModel
```python
model = LcoptModel('MyFirstModel')
```

or load an existing one
```python
model = LcoptModel(load = 'MyFirstModel')
```

Then launch the interactive model creator/analyser
```python
model.launch_interact()
```

## Option 2. lcopt_launcher.py (Simpler, only access to GUI)

Using this option, you can type a couple of commands into the command line/console and use the GUI from then on

First, download `lcopt_launcher.py` from [here](https://raw.githubusercontent.com/pjamesjoyce/lcopt/master/lcopt_launcher.py)

Save it in the folder you want to store your models in

Open the console/command line

`cd` into your chosen folder and run `lcopt_launcher.py`

```
activate lcopt
cd C:\Users\pjjoyce\Documents\01_Lcopt_models
python lcopt_launcher.py
```

You'll get an option to either create a new model or open an exising one. Make your choice and the GUI will open in your default browser.

# LCOPT INTERACT - the GUI

Running the GUI via each of the options above launches a Flask server that gives you a nice UI to interact with the models. You can add processes, link them together, add biosphere and technosphere exchanges, and create parameter sets and functions using your parameters. It should be pretty intuitive, if you get stuck, try the 'more info...' buttons.

When your model's ready you can export it to SimaPro as a .csv file and the parameter sets you've created as an Excel file (Note: you need SimaPro developer to import the parameter sets from the Excel file).

To run the analyses interactively using brightway2 there's an additional setup step. See below.

The 'QUIT' button in the top right hand corner will shut down the Flask server and tell you to close the window.

If you're running from a jupyter notebook, this frees up the notebook again so you can run any commands you need to.

One useful command is `model.save()` which will save any unsaved changes (you can also save by clicking on the save button in LcoptInteract, but in case you forget you can use `model.save()`)

The model is saved as a .lcopt file in your working directory (its really a .pickle file, but the .lcopt extension makes it easier to filter on in the lcopt_launcher file picker)

NOTE: The next time you run the GUI from a notebook you need to use  
```python
model = LcoptModel(load = 'MyFirstModel')
```

If you don't it'll create a new blank model called 'MyFirstModel'. If you do do this by accident fear not - it won't overwrite your .lcopt file until you save it. 
Quit interact by hitting the QUIT button and go back and change your command (just don't click the save button or run `model.save()` in the meantime)


## Running the analyses in LcoptInteract with brightway2

To use the interactive analysis feature, you need to set up brightway2 to play nicely with lcopt.

Lcopt needs to set up its own brightway project template so that it can create a new brightway project for each of your models using this template.

### Step 1. Download the Ecoinvent 3.3 cutoff database (Ecoinvent license required)

Log into [ecoinvent.org](http://www.ecoinvent.org/login-databases.html) and go to the Files tab
Download the file called `ecoinvent 3.3_cutoff_ecoSpold02.7z`
Extract the file somewhere sensible on your machine, you might need to download [7-zip](http://www.7-zip.org/download.html) to extract the files.

Make a note of the path of the folder that contains the .ecospold files, its probably `<path/extracted/to>/datasets/`

### Step 2a. Run the setup utility in a jupyter notebook/python shell

Fire up your chosen python shell, then use

```python
from lcopt.utils import lcopt_bw2_setup
ecospold_path = r'path/to/ecospold/files' # put your own path in here
lcopt_bw2_setup(ecospold_path)
```
It'll take a while, but once its done it'll return ```True``` if it worked properly


### Step 2b. Download lcopt_bw2_setup.py and use that instead

Download the helper script from [here](https://raw.githubusercontent.com/pjamesjoyce/lcopt/master/lcopt_bw2_setup.py)

At the command line type
```
cd folder/you/downloaded/it/to
python lcopt_bw2_setup.py path/to/ecospold/files # use "" if there are spaces in your path
```

