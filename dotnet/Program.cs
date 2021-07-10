using System;
using System.Runtime.InteropServices;
using System.Text;
using Microsoft.Win32;
using static dotnet.Winapi;

namespace dotnet
{
    class Program
    {

        static void Main(string[] args)
        {
            System.Threading.Thread.Sleep(2000);

            string pressString = args[0];

            Console.WriteLine(pressString);

            PressString("Hello World!👋");
            PressKey((ushort)WinapiKeys.VirtualKeyShort.RETURN);

        }

        /// <summary> Presses the characters in string using SendKey.</summary>
        /// <param name="inputString">The string to press</param>
        static void PressString(string inputString)
        {
            if (inputString.Length == 0) return;
            Input[] inputs = new Input[]
            {
                new Input
                {
                    type = (int)InputType.Keyboard,
                    u = new InputUnion{
                        ki = new KeyboardInput{
                            wVk = 0x0,
                            dwExtraInfo = GetMessageExtraInfo()
                        }
                    }
                }
            };

            for (int i = 0; i < inputString.Length; i++)
            {
                inputs[0].u.ki.wScan = (ushort)inputString[i];

                inputs[0].u.ki.dwFlags = (uint)(KeyEventF.KeyDown | KeyEventF.Unicode);
                SendInput((uint)inputs.Length, inputs, Marshal.SizeOf(typeof(Input)));

                inputs[0].u.ki.dwFlags = (uint)(KeyEventF.KeyUp | KeyEventF.Unicode);
                SendInput((uint)inputs.Length, inputs, Marshal.SizeOf(typeof(Input)));
            }
        }

        /// <summary>Presses a key.</summary>
        /// <param name="wVK">Virtual Key Code of the key</param>
        static void PressKey(ushort wVK)
        {
            Input[] inputs = new Input[]
            {
                new Input
                {
                    type = (int)InputType.Keyboard,
                    u = new InputUnion{
                        ki = new KeyboardInput{
                            wVk = wVK,
                            dwExtraInfo = GetMessageExtraInfo()
                        }
                    }
                }
            };

            inputs[0].u.ki.dwFlags = (uint)(KeyEventF.KeyDown);
            SendInput((uint)inputs.Length, inputs, Marshal.SizeOf(typeof(Input)));

            inputs[0].u.ki.dwFlags = (uint)(KeyEventF.KeyUp);
            SendInput((uint)inputs.Length, inputs, Marshal.SizeOf(typeof(Input)));
        }

    }

}
