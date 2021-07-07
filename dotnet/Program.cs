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

            string emoji = "👌";

            Input[] inputs = new Input[]
            {
                new Input
                {
                    type = (int)InputType.Keyboard,
                    u = new InputUnion
                    {
                        ki = new KeyboardInput
                        {
                            wVk = 0x0,
                            wScan = (ushort)emoji[0],
                            dwFlags = (uint)(KeyEventF.KeyDown | KeyEventF.Unicode),
                            dwExtraInfo = GetMessageExtraInfo()
                        }
                    }
                }
            };

            SendInput((uint)inputs.Length, inputs, Marshal.SizeOf(typeof(Input)));

            inputs[0].u.ki.wScan = (ushort)emoji[1];

            SendInput((uint)inputs.Length, inputs, Marshal.SizeOf(typeof(Input)));
        }

    }
}
