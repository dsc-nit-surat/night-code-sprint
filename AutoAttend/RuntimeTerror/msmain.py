from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common import exceptions
import time
import json
from threading import Timer




def wait_until_found(sel, timeout, driver):
    try:
        element_present = EC.visibility_of_element_located((By.CSS_SELECTOR, sel))
        WebDriverWait(driver, timeout).until(element_present)
        return driver.find_element_by_css_selector(sel)
    except exceptions.TimeoutException:
        print(f"Timeout waiting for element: {sel}")
        return None


f = open('teams.json')
config = json.load(f)

def login(driver):
    #Username
    username = wait_until_found('#i0116', 5, driver)
    if username is not None:
        username.send_keys(config["login"]["email"])
        next_btn = wait_until_found('#idSIButton9', 5, driver)
        if next_btn is not None:
            next_btn.click()

    #password
    password = wait_until_found('#i0118', 5, driver)
    if password is not None:
        password.send_keys(config["login"]["pwd"])
        next_btn = wait_until_found('#idSIButton9', 5, driver)
        if next_btn is not None:
            next_btn.click()

    #stay signed in
    next_btn = wait_until_found('#idSIButton9', 5, driver)
    if next_btn is not None:
        next_btn.click()
    #Continue to web app 
    driver.find_element_by_css_selector('#download-desktop-page > div > a').click()
    return 1



def openTeam(driver, tm, tim):
    team_xp = '#team-19\:' + config["team"][tm] + '\@thread\.tacv2 > a'

    team_to_join = wait_until_found(team_xp, 10, driver)
    if team_to_join is not None:
        team_to_join.click()
    else:
        return "No team found. Check xpath"
    #finding join button
    
    join_meeting = wait_until_found("button[ng-click='ctrl.joinCall()']", 60, driver)
    if join_meeting is not None:
        print("Found")
        join_meeting.click()
    else:
        print("No active meeting found")
        return "No active meeting found"
    print("Reached here")
    
    #turn off mic
    audio_btn = wait_until_found("toggle-button[data-tid='toggle-mute']>div>button", 4, driver)
    audio_is_on = audio_btn.get_attribute("aria-pressed")
    if audio_is_on == "true":
        audio_btn.click()
        
    #turn off camera
    video_btn = wait_until_found("toggle-button[data-tid='toggle-video']>div>button", 4, driver)
    video_btn = driver.find_element_by_css_selector("toggle-button[data-tid='toggle-video']>div>button")
    video_is_on = video_btn.get_attribute("aria-pressed")
    if video_is_on == "true":
        video_btn.click()
    time.sleep(4)
    #join meeting
    join_now_btn = driver.find_element_by_css_selector("button[data-tid='prejoin-join-button']")
    if join_now_btn is not None:
        join_now_btn.click()

    
    tim = float(tim)
    tim = tim*60
    print("Sleeping")
    time.sleep(tim)
    driver.close()
    print("Done")
    return "1"

def startmeet(tm, tim):
    #Browser configuration
    opt = Options()
    opt.add_argument("--disable-infobars")
    opt.add_argument("start-maximized")
    opt.add_argument("--disable-extensions")
    opt.add_experimental_option("prefs", { \
        "profile.default_content_setting_values.media_stream_mic": 1, 
        "profile.default_content_setting_values.media_stream_camera": 1,
        "profile.default_content_setting_values.notifications": 1 
    })
    driver = webdriver.Chrome(options=opt)
    driver.get("https://teams.microsoft.com/")
    time.sleep(4)
    

    loginStat = login(driver)
    if loginStat == 1:
        time.sleep(5)
    else:
        return loginStat

    joinStat = openTeam(driver, tm, tim)
    return joinStat
