import discord
from discord.ext import commands
import json
from msmain import startmeet
from threading import Thread
import time


def meetThread(tm, tim):
    # th = Thread(target=startmeet, args=(tm, tim,))
    # th.start()
    startmeet(tm, tim)


class AutoJoin(commands.Cog):

    def __init__(self, client):
        self.client = client

    @commands.command()
    async def dd(self, ctx):
        await ctx.channel.send("Hello")
    

    @commands.command()
    async def teams(self, ctx):
        f = open('teams.json')
        data = json.load(f)
        message = ""
        for i in data['team'].keys():
            message = message + i + '\n'
        await ctx.channel.send(message)

    @commands.command()
    async def join(self, ctx, tm= "Test", tim="5"):
        meetThread(tm, tim)
        await ctx.channel.send("stat")



def setup(client):
    client.add_cog(AutoJoin(client))