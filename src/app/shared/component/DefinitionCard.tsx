import { Definition } from '@/types'
import { Typography, Card, CardContent } from '@mui/material'
import React from 'react'

type Props = {
    word: string
    definitionList: Definition[]
}

const DefinitionCard = ({word, definitionList}: Props) => {
    const definitionJSX = definitionList.map((definition, index: number) => {
        return (
          <div key={index}>
            <Typography sx={{ mb: 1.0 }} color="text.secondary">
              {definition.meta.synsetType}
            </Typography>
            <Typography sx={{ mb: 2.5 }} variant="body2">
              {definition.glossary}
            </Typography>
          </div>
        );
      });
      
      return (
        <Card sx={{ width: 600, marginBottom: 3 }} key={word}>
          <CardContent>
            <Typography variant="h5" component="div">
              {word}
            </Typography>
            {definitionJSX}
          </CardContent>
        </Card>
      );
}

export default DefinitionCard