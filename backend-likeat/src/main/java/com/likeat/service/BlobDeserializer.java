package com.likeat.service;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Base64;

public class BlobDeserializer extends JsonDeserializer<Blob> {

    @Override
    public Blob deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException {
        try {
            String base64Encoded = jsonParser.getValueAsString();
            byte[] bytes = Base64.getDecoder().decode(base64Encoded);
            return new SerialBlob(bytes);
        } catch (SQLException e) {
            throw new IOException("Unable to deserialize Blob", e);
        }
    }
}