from pyautogui import press
import sys


def main():
    try:
        press(sys.argv[1])
    except IndexError:
        sys.stderr.write("Not enough args")
        sys.stderr.flush()


if __name__ == "__main__":
    main()
