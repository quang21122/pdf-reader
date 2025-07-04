'use client'

import React from 'react'
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Fab,
  Divider
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material'

interface Note {
  id: string
  content: string
  page_number: number
  created_at: string
}

interface NoteSidebarProps {
  open: boolean
  notes?: Note[]
  onClose?: () => void
  onAddNote?: () => void
  onEditNote?: (noteId: string) => void
  onDeleteNote?: (noteId: string) => void
}

export default function NoteSidebar({
  open,
  notes = [],
  onClose,
  onAddNote,
  onEditNote,
  onDeleteNote
}: NoteSidebarProps) {
  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={open}
      onClose={onClose}
      className="no-print"
    >
      <Box className="sidebar-width h-full flex flex-col">
        <Box className="p-4 border-b">
          <Typography variant="h6" className="font-medium">
            Notes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        
        <Box className="flex-1 overflow-auto">
          {notes.length === 0 ? (
            <Box className="p-4 text-center">
              <Typography variant="body2" color="text.secondary">
                No notes yet. Click the + button to add your first note.
              </Typography>
            </Box>
          ) : (
            <List>
              {notes.map((note, index) => (
                <React.Fragment key={note.id}>
                  <ListItem
                    className="flex-col items-start"
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => onEditNote?.(note.id)}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => onDeleteNote?.(note.id)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2" className="font-medium">
                          Page {note.page_number}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" className="mt-1">
                          {note.content.length > 100 
                            ? `${note.content.substring(0, 100)}...` 
                            : note.content
                          }
                        </Typography>
                      }
                    />
                    <Typography variant="caption" color="text.secondary" className="mt-2">
                      {new Date(note.created_at).toLocaleDateString()}
                    </Typography>
                  </ListItem>
                  {index < notes.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
        
        <Box className="p-4 border-t">
          <Fab
            color="primary"
            aria-label="add note"
            onClick={onAddNote}
            size="medium"
            className="w-full"
          >
            <AddIcon />
          </Fab>
        </Box>
      </Box>
    </Drawer>
  )
}
