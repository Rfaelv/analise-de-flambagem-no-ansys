from ansys.mapdl.core import launch_mapdl
from mapdl_material import Material
from mapdl_finiteElement import FiniteElement
from mapdl_geometry_I import IProfile
from mapdl_geometry_tubular import TubularProfile
from mapdl_geometry_C import CProfile
from mapdl_geometry_C2 import C2Profile
from mapdl_geometry_rack import RackProfile
from mapdl_geometry_angle import AngleProfile
import sys

class Mapdl:
    def __init__(self, path):
        self.pathToLaunch = path

    def initialize(self):
        try:
            self.mapdl = launch_mapdl()
        except:
            print('ERROR-launch_mapdl')
            sys.exit()
        
    def getInstance(self):
        return self.mapdl

    def createMaterial(self, materialList):
        self.material = Material(self.mapdl)

        for i, material in enumerate(materialList):
            self.material.createMaterial(i + 1, material["materialType"], material["materialProperties"])
    
    def createFiniteElement(self):
        self.finiteElement = FiniteElement()
        self.finiteElement.createShell181(self.mapdl)
    
    def createProfile(self, profileProps):
        self.sectionType = profileProps[0]
        if self.sectionType["I"]:
            self.Iprofile = IProfile(self.mapdl, profileProps[1])
            self.Iprofile.createSection()
            self.Iprofile.createProfile(profileProps[2], profileProps[3])

        elif self.sectionType["tubular"]:
            self.tubularProfile = TubularProfile(self.mapdl, profileProps[1])
            self.tubularProfile.createSection()
            self.tubularProfile.createProfile(profileProps[2], profileProps[3])

        elif self.sectionType["C"]:
            self.CProfile = CProfile(self.mapdl, profileProps[1])
            self.CProfile.createSection()
            self.CProfile.createProfile(profileProps[2], profileProps[3])

        elif self.sectionType["C2"]:
            self.C2Profile = C2Profile(self.mapdl, profileProps[1])
            self.C2Profile.createSection()
            self.C2Profile.createProfile(profileProps[2], profileProps[3])

        elif self.sectionType["rack"]:
            self.RackProfile = RackProfile(self.mapdl, profileProps[1])
            self.RackProfile.createSection()
            self.RackProfile.createProfile(profileProps[2], profileProps[3])

        elif self.sectionType["angle"]:
            self.AngleProfile = AngleProfile(self.mapdl, profileProps[1])
            self.AngleProfile.createSection()
            self.AngleProfile.createProfile(profileProps[2], profileProps[3])
    
    def createMesh(self, meshData):
        return

    def open_gui(self):
        self.mapdl.open_gui()
