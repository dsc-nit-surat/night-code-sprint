package com.example.android.noteme.database;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

import com.example.android.noteme.dao.NoteDao;
import com.example.android.noteme.entities.Note;

@Database(entities = Note.class, version = 1, exportSchema = false)
public abstract class NotesDataBase extends RoomDatabase {
    public static NotesDataBase notesDataBase;

    public static synchronized NotesDataBase getDataBase(Context context) {
        if (notesDataBase == null) {
            notesDataBase = Room.databaseBuilder(
                    context,
                    NotesDataBase.class,
                    "notes_db"
            ).build();
        }
        return notesDataBase;
    }
    public abstract NoteDao noteDao();
}
